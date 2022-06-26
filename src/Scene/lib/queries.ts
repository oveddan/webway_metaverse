import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Erc721Token } from "../Config/token";
import { Modification } from "../Config/types/modifications";
import { SceneConfiguration } from "../Config/types/scene";

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

const ACTIVE_EFFECTS_QUERY = `
{
  activeEffects {
    active
  }
}
`;

const TOKEN_GQL = gql(TOKEN_URIS_QUERY);
const OWNERS_GQL = gql(OWNERS_QUERY);
const ACTIVE_GQL = gql(ACTIVE_EFFECTS_QUERY);

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

    if (!tokenForId) {
      setScene({
        loading: false,
        valid: false,
      });
      return;
    }

    (async () => {
      const tokenJson = (await (
        await fetch(tokenForId?.uri)
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
  name: string;
  uri: string;
  active: boolean;
  id: string;
}[];

export const useActiveEffects = (tokenId?: string) => {
  const { loading: loadingActive, data: dataActive } = useQuery<{
    activeEffects: ActiveEffectsQueryResult;
  }>(ACTIVE_GQL, { pollInterval: 2500 });

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
          const modification = (await (
            await fetch(effect.uri)
          ).json()) as Modification;
          return {
            active: effect.active,
            modification,
            name: effect.name,
            id: effect.id,
          };
        })
      );

      const reduced = parsedEffects.reduce((x: ActiveEffects, effect) => {
        return {
          ...x,
          [effect.id]: effect,
        };
      }, {});

      setEffects(reduced);
    })();
  }, [loadingActive, dataActive, tokenId]);

  return effects;
};
