import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "token";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const logUserIn = (token) => {
    localStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
};
export const logUserOut = (history) => {
    localStorage.removeItem(TOKEN);
    history?.replace();
    window.location.reload();
};

export const isDarkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));
export const enableDarkMode = () => {
    localStorage.setItem(DARK_MODE, "enabled");
    isDarkModeVar(true);
};

export const disableDarkMode = () => {
    localStorage.removeItem(DARK_MODE);
    isDarkModeVar(false);
};

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: localStorage.getItem(TOKEN),
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            User: {
                keyFields: (user) => `User:${user.username}`,
            }
        }
    }),
});