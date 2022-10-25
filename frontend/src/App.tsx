import * as React from "react";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/dm-sans";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/r/:subreddit",
    element: <Dashboard />,
  },
]);

const theme = extendTheme(
  {
    colors: {
      brand: {
        50: "#FAF5FF",
        100: "#E9D8FD",
        200: "#D6BCFA",
        300: "#B794F4",
        400: "#9F7AEA",
        500: "#805AD5",
        600: "#6B46C1",
        700: "#553C9A",
        800: "#44337A",
        900: "#322659",
      },
    },
    useSystemColorMode: true,
    fonts: {
      heading: `'DM Sans', sans-serif`,
      body: `'DM Sans', sans-serif`,
    },
  },
  withDefaultColorScheme({
    colorScheme: "brand",
  })
);

export const App = () => (
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);
