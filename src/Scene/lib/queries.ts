import { gql, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { Erc721Token } from "../Config/token";
import { Modification } from "../Config/types/modifications";
import { SceneConfiguration } from "../Config/types/scene";
import { convertURIToHTTPS } from "./ipfs";

const TOKEN_URIS_QUERY = `
{
  tokenURIs {
    id
    uri
  }
}
`;

export type TokenUri = {
  id: string;
  uri: string;
};

const OWNERS_QUERY = `
{
  owners {
    id
  }
}
`;

const activeEffectsQuery = (tokenId: string) => gql`
{
  activeEffects(where: {tokenId: "${tokenId}"}) {
    uri,
    key,
    active
  }
}
`;

const TOKEN_GQL = gql(TOKEN_URIS_QUERY);
const OWNERS_GQL = gql(OWNERS_QUERY);

export type TokenQueryData = { tokenURIs: TokenUri[] };
export type OwnersQueryData = { owners: { id: string }[] };
export type ActiveEffectsQueryData = {};

export const useTokens = () => {
  const { loading, data: dataToken } = useQuery<TokenQueryData>(TOKEN_GQL, {
    pollInterval: 2500,
  });

  const [tokens, setTokens] = useState<TokenUri[]>([]);

  useEffect(() => {
    if (dataToken && dataToken.tokenURIs.length > 0) {
      setTokens(dataToken.tokenURIs);
    }
  }, [dataToken]);

  return {
    tokens,
    loading,
  };
};

export const useTokenScene = (tokenId: string) => {
  const { tokens, loading } = useTokens();

  const [scene, setScene] = useState<{
    scene?: SceneConfiguration;
    loading: boolean;
    valid?: boolean;
  }>({
    loading: true,
  });

  useEffect(() => {
    setScene({
      loading: true,
    });

    if (loading) return;

    const tokenForId = tokens.find(({ id }) => id === tokenId);

    console.log({tokenId,tokens, tokenForId});
    if (!tokenForId) {
      setScene({
        loading: false,
        valid: false,
      });
      return;
    }

    (async () => {
      if (!tokenForId?.uri) return;

      const ipfsUrl = convertURIToHTTPS({url:tokenForId?.uri});

      console.log({ipfsUrl});

      const tokenJson = (await (
        await fetch(ipfsUrl )
      ).json()) as Erc721Token;

      setScene({
        loading: false,
        valid: true,
        scene: tokenJson.scene_config,
      });
    })();
  }, [tokenId, tokens, loading]);

  return scene;
};

export const useOwner = (tokenId?: string) => {
  const { loading: loadingOwners, data: dataOwners } =
    useQuery<OwnersQueryData>(OWNERS_GQL, { pollInterval: 10000 });

  const [owner, setOwner] = useState<string>();

  useEffect(() => {
    if (loadingOwners || !tokenId) {
      setOwner(undefined);
      return;
    }

    const parsedOwners = dataOwners?.owners?.map((result) => {
      const [owner, id] = result.id.split(" ");
      return { owner, id };
    });

    const tokenOwner = parsedOwners?.find(({ id }) => id === tokenId)?.owner;

    if (tokenOwner) {
      setOwner(tokenOwner);
    } else {
      setOwner(undefined);
    }
  }, [loadingOwners, dataOwners, tokenId]);

  return owner;
};

type ActiveEffects = {
  [key: string]: {
    modification: Modification;
    name: string;
    active: boolean;
  };
};

type ActiveEffectsQueryResult = {
  key: string;
  uri: string;
  active: boolean;
}[];

export const useActiveEffects = (tokenId?: string) => {
  // @ts-ignore
  const query = useMemo(() => activeEffectsQuery(tokenId), [tokenId]);
  const { loading: loadingActive, data: dataActive } = useQuery<{
    activeEffects: ActiveEffectsQueryResult;
    // @ts-ignore
  }>(query, { pollInterval: 2500 });

  const [effects, setEffects] = useState<ActiveEffects>();

  useEffect(() => {
    if (loadingActive || !tokenId) {
      setEffects({});
      return;
    }

    if (!dataActive) return;

    (async () => {
      const parsedEffects = await Promise.all(
        dataActive.activeEffects.map(async (effect) => {
          const toFetch = convertURIToHTTPS({ url: effect.uri });
          const data = await fetch(toFetch);
          const modification = (await data.json()) as Modification;
          return {
            active: effect.active,
            modification,
            name: effect.key,
          };
        })
      );

      const reduced = parsedEffects.reduce((x: ActiveEffects, effect) => {
        return {
          ...x,
          [effect.name]: effect,
        };
      }, {});

      setEffects(reduced);
    })();
  }, [loadingActive, dataActive, tokenId]);

  return effects;
};
