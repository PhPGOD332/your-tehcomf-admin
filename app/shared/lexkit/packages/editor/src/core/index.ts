export {
  createEditorSystem,
  BaseProvider,
  useBaseEditor,
} from "./createEditorSystem";
export { createExtension } from "./createExtension";
export type {
  EditorConfig,
  EditorContextType,
  Extension,
  ExtensionCategory,
} from "~/shared/lexkit/packages/editor/src/extensions/types";
export { defaultLexKitTheme, mergeThemes, isLexKitTheme } from "./theme";
export type { LexKitTheme } from "./theme";
