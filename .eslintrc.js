module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    "no-restricted-globals": "off", // allow confirm(), alert(), prompt()
  },
};
