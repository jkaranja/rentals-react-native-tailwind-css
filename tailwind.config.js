/** @type {import('tailwindcss').Config} */
module.exports = {
  //darkMode: "class", //dark mode is applied if <html class="dark">. use dark: modifier for dark mode styling
  //if above is not added, dark: is based on 'prefers-color-scheme'/system preference
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      //brand/primary color
      emerald: {
        // light: "#3db379", //rgba(61,179,121,255)
        // DEFAULT: "#00b973", ////rgba(0,165,81,255)
        // dark: "#00a551", //rgba(0,185,115,255)
        //option2
        light: "#21de9a", //#3db379//rgba(61,179,121,255)
        DEFAULT: "#3ac794", //#04b674 //#09757a//rgba(0,165,81,255)//#00b973//not making color white
        dark: "#00a85c", //#00a551//rgba(0,185,115,255)
      },
      //accent/error/danger/secondary color
      red: {
        light: "#e43b66",
        DEFAULT: "#de194e",
        dark: "#b91048",
      },
      white: {
        DEFAULT: "#fff",
      },
      //info/blueish
      Sky: {
        light: "#2ab7f6",
        DEFAULT: "#0288d1",
        dark: "#0278bd",
      },
      //success
      green: {
        light: "#4ade80",
        DEFAULT: "#16a34a",
        dark: "#15803d",
      },
      //warning
      orange: {
        light: "#fd9703",
        DEFAULT: "#f37c02",
        dark: "#ed6c02",
      },

      //gray->dark mode bg, text, borders(light mode too)
      gray: {
        light: "#e2e8f0",
        lighter: "#f1f5f9",
        lightest: "#f8fafc",
        muted: "rgb(102, 112, 133)", //#a4acb2//muted text + borders in dark mode
        dimmed: "hsla(240,7%,62%,1)", //#C5D6E0
        dull: "rgb(242, 244, 247)", //lavender//border light
        disabled: "rgba(0, 0, 0, 0.26)", //disabled state color
        input: "rgba(67,59,54,.9)", //dark mode-input color
        outline: "rgb(150, 142, 152)",
        bg: "#fafafa", //#f7f7f7
        DEFAULT: "#1e1e20", //main
        //mui
        main: "rgb(16, 24, 40)", //dark color

        //dark mode theme 1
        divider: "#667085", //muted in hex
        dark: "#1e1e20", //content box + headers//#1e2840(rgba(30,40,64,255))//#071d2b
        darker: "#161618", //screen bg//hsla(0,0%,13%,1);
        darkest: "#000", ///pure black

        //dark mode theme 2
        // divider: "#2c333b"
        // dark: "#1a1d1e", //content box+headers//alt: #202425
        // darker: "#151718", //screen bg //alt:
        // darkest: "#000", //pure black
      },
    },
    extend: {},
  },
  plugins: [],
};
