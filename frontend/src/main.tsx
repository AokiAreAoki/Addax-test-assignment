import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import GlobalStyle from "./components/GlobalStyle";
import { ModalBase } from "./components/SimpleModal";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<QueryClientProvider client={queryClient}>
				<GlobalStyle />
				<ModalBase />
				<App />
			</QueryClientProvider>
		</PersistGate>
	</Provider>,
);
