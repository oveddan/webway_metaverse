import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Erc721Token } from "../Config/token";
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

export type TokenQueryData = { tokenURIs: TokenUri[] };

export const useTokens = () => {
  const TOKEN_GQL = gql(TOKEN_URIS_QUERY);

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

    console.log({
      tokens,
      tokenId,
    });

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
