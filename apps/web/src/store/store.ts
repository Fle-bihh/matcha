import { Container } from "@/container/Container";
import { createStore } from "@/store";

// Créer le container et le store séparément pour éviter les dépendances circulaires
const container = new Container();

// Le store sera créé dans le container
export const store = container.store;
