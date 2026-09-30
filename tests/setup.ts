import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
document.insertBefore(
	document.implementation.createDocumentType("html", "", ""),
	document.documentElement,
);
