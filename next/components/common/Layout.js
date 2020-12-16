import React from "react";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return <div>{children}</div>;
};

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default Layout;
