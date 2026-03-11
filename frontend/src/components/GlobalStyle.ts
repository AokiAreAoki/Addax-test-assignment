import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    overflow: hidden;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 0.8rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    color: #1e293b;
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }

  @keyframes spin {
    from {
        transform:rotate(-45deg);
    }
    to {
        transform:rotate(calc(3 * 360deg - 45deg));
    }
}
`;

export default GlobalStyle;
