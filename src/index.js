import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "@fontsource/poppins/700.css"
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#14e60c",
    500: "#14e60c",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819"
  }
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  fonts: {
    heading: "Poppins",
    body: "Open Sans",
  },
};

const theme = extendTheme({ colors, config });

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  rootElement
);

