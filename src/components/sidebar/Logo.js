import styled from 'styled-components'
import React from 'react'

const Container = styled.svg`
  display: block;
  width: 100%;
`

const Metronome = styled.path`
  fill: ${p => p.theme.colors.primary};
`

const Wallet = styled.path`
  fill: ${p => p.theme.colors.light};
`

export default class Logo extends React.Component {
  render() {
    return (
      <Container viewBox="0 0 235 63">
        <Metronome d="M131.807 5.85c-5.458 0-10.07 4.542-10.07 9.92v11.92c0 1.125 1.089 2.188 2.239 2.188 1.18 0 2.139-.98 2.139-2.188V15.77c.054-3.112 2.554-5.544 5.692-5.544 3.107 0 5.543 2.435 5.543 5.543V27.69c0 1.185 1.002 2.188 2.186 2.188 1.167 0 2.19-1.022 2.19-2.188V15.77c0-5.47-4.45-9.92-9.92-9.92M198.265 5.85c-3.127 0-5.973 1.496-7.835 3.781-1.818-2.299-4.625-3.78-7.776-3.78-5.458 0-10.071 4.541-10.071 9.918V27.69c0 1.125 1.088 2.188 2.24 2.188 1.178 0 2.137-.98 2.137-2.188V15.77c.055-3.112 2.556-5.544 5.694-5.544 3.106 0 5.539 2.432 5.542 5.538V27.69c0 .014.005.028.005.042.024 1.167 1.01 2.146 2.183 2.146.009 0 .017-.003.026-.003l.024.003c1.18 0 2.139-.98 2.139-2.188V15.77c.053-3.112 2.554-5.544 5.692-5.544 3.107 0 5.543 2.435 5.543 5.543V27.69c0 1.185 1.002 2.188 2.186 2.188 1.167 0 2.19-1.022 2.19-2.188V15.77c0-5.47-4.45-9.92-9.92-9.92M106.568 25.627c-4.218 0-7.649-3.432-7.649-7.65 0-4.22 3.431-7.65 7.65-7.65 4.217 0 7.65 3.43 7.65 7.65 0 4.218-3.433 7.65-7.65 7.65m0-19.552c-6.574 0-11.9 5.329-11.9 11.902 0 6.573 5.326 11.9 11.9 11.9 6.572 0 11.9-5.327 11.9-11.9s-5.328-11.902-11.9-11.902M157.224 25.627c-4.218 0-7.65-3.432-7.65-7.65 0-4.22 3.432-7.65 7.65-7.65 4.219 0 7.649 3.43 7.649 7.65 0 4.218-3.43 7.65-7.65 7.65m0-19.552c-6.572 0-11.9 5.329-11.9 11.902 0 6.573 5.328 11.9 11.9 11.9 6.574 0 11.902-5.327 11.902-11.9s-5.328-11.902-11.901-11.902M91.43 5.53c-3.681 0-6.663 1.2-8.864 3.565-4.094 4.4-3.84 11.402-3.797 12.186v6.384c0 1.22.993 2.213 2.214 2.213a2.216 2.216 0 0 0 2.213-2.213l-.006-6.615c-.005-.04-.323-5.78 2.615-8.939 1.35-1.45 3.19-2.156 5.625-2.156a2.215 2.215 0 0 0 2.213-2.213c0-1.22-.992-2.213-2.213-2.213M74.745 5.375h-4.48v-3.25A2.126 2.126 0 0 0 68.14 0a2.125 2.125 0 0 0-2.127 2.125l-.052 21.673c-.046 1.854.988 5.51 5.255 6.361a2.144 2.144 0 0 0 .839-4.207c-1.627-.325-1.805-1.927-1.806-2.41l.017-13.916h4.48a2.125 2.125 0 0 0 0-4.251M58.276 15.196a.928.928 0 0 1-.753.388h-12.74a.932.932 0 0 1-.749-.38.9.9 0 0 1-.134-.81c.751-2.37 3.08-5.138 7.167-5.138 5.038 0 6.806 3.578 7.331 5.116a.911.911 0 0 1-.122.824M51.067 5.35c-6.545 0-11.91 5.503-11.959 12.268.05 6.824 5.305 12.212 11.962 12.261 3.545 0 6.425-1.058 8.796-3.239.277-.252.445-.547.514-.878.04-.15.067-.307.067-.469 0-1.06-.909-1.92-2.03-1.92a2.09 2.09 0 0 0-1.304.457c-.153.091-.47.366-.47.366-1.3.99-3.554 1.54-5.615 1.366-1.946-.167-4.085-1.174-5.198-2.448-.7-.657-1.285-1.682-1.648-2.858l.01-.005c-.31-1.137.854-1.266.854-1.266l.001-.003H60.64c1.186 0 2.065-.655 2.186-1.629l.047-.152c-.007.011.002-.05.002-.249v-.254c-.39-6.564-5.356-11.348-11.807-11.348M215.872 14.393c.751-2.37 3.08-5.137 7.167-5.137 5.038 0 6.806 3.578 7.331 5.116a.911.911 0 0 1-.122.824.928.928 0 0 1-.753.388h-12.74a.932.932 0 0 1-.749-.38.9.9 0 0 1-.134-.811m7.17 15.485c3.545 0 6.424-1.059 8.796-3.238.277-.252.445-.548.513-.879.041-.151.068-.306.068-.469 0-1.061-.91-1.92-2.03-1.92-.499 0-.95.176-1.304.458-.153.09-.47.365-.47.365-1.3.99-3.555 1.54-5.615 1.366-1.946-.167-4.085-1.173-5.198-2.448-.7-.657-1.285-1.682-1.648-2.858l.01-.005c-.31-1.137.854-1.266.854-1.266v-.003h15.593c1.186 0 2.064-.654 2.186-1.629l.046-.151c-.006.01.003-.051.003-.249v-.255c-.39-6.564-5.356-11.348-11.807-11.348-6.545 0-11.91 5.503-11.959 12.268.05 6.824 5.304 12.213 11.962 12.261M25.68 5.85c-3.126 0-5.971 1.496-7.834 3.781-1.817-2.299-4.625-3.78-7.775-3.78C4.613 5.85 0 10.391 0 15.768V27.69c0 1.125 1.088 2.188 2.24 2.188 1.178 0 2.137-.98 2.137-2.188V15.77c.054-3.112 2.555-5.544 5.694-5.544 3.105 0 5.539 2.432 5.542 5.538V27.69c0 .014.005.028.005.042.023 1.167 1.01 2.146 2.182 2.146l.027-.003c.007 0 .015.003.023.003 1.18 0 2.14-.98 2.14-2.188V15.77c.053-3.112 2.554-5.544 5.69-5.544 3.109 0 5.544 2.435 5.544 5.543V27.69c0 1.185 1.002 2.188 2.187 2.188 1.166 0 2.189-1.022 2.189-2.188V15.77c0-5.47-4.448-9.92-9.92-9.92" />
        <Wallet d="M173.116 48.2h3.317l-5.383 13.728h-2.963l-3.398-8.998-3.316 8.998h-2.99L153 48.2h3.48l3.534 9.677 3.56-9.677h2.447l3.561 9.759 3.534-9.76zm18.595 0v13.728h-3.344v-2.202a4.41 4.41 0 0 1-1.794 1.78c-.78.426-1.668.64-2.664.64-1.196 0-2.257-.29-3.18-.87-.925-.58-1.641-1.405-2.148-2.474-.508-1.07-.762-2.311-.762-3.725 0-1.413.259-2.668.775-3.765.517-1.096 1.237-1.948 2.161-2.555.925-.607 1.976-.91 3.154-.91.996 0 1.884.212 2.664.638a4.41 4.41 0 0 1 1.794 1.78V48.2h3.344zm-6.878 11.281c1.124 0 1.993-.39 2.61-1.169.616-.78.924-1.876.924-3.29 0-1.449-.308-2.564-.924-3.343-.617-.78-1.496-1.169-2.637-1.169-1.124 0-1.998.404-2.624 1.21-.625.806-.937 1.926-.937 3.357 0 1.414.312 2.501.937 3.262.626.762 1.51 1.142 2.65 1.142zm11.575 2.447V41.92h3.37v20.008h-3.37zm8.095 0V41.92h3.37v20.008h-3.37zm19.11-6.688h-9.46c.073 1.468.44 2.551 1.101 3.249.662.698 1.645 1.046 2.95 1.046 1.504 0 2.9-.489 4.186-1.467l.979 2.337c-.653.526-1.455.947-2.406 1.264a9.1 9.1 0 0 1-2.895.476c-2.247 0-4.014-.634-5.301-1.903-1.287-1.268-1.93-3.008-1.93-5.22 0-1.395.28-2.636.842-3.723.562-1.088 1.35-1.935 2.366-2.542 1.014-.607 2.165-.91 3.452-.91 1.885 0 3.375.61 4.472 1.834 1.096 1.223 1.644 2.904 1.644 5.043v.516zm-6.035-4.947c-.906 0-1.644.267-2.215.802-.57.534-.938 1.31-1.101 2.324h6.388c-.108-1.033-.421-1.812-.938-2.338-.516-.525-1.227-.788-2.134-.788zm13.24.462v6.144c0 1.613.751 2.419 2.256 2.419.416 0 .87-.072 1.359-.217v2.69c-.598.218-1.323.327-2.175.327-1.559 0-2.755-.435-3.588-1.305-.834-.87-1.25-2.12-1.25-3.751v-6.307h-2.638V48.2h2.637v-3.344l3.398-1.142V48.2h3.643v2.555h-3.643z" />
      </Container>
    )
  }
}
