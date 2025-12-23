import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

interface LayoutSizesContextType {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
  profileDrawerWidth: number;
  setProfileDrawerWidth: (width: number) => void;
}

const LayoutSizesContext = createContext<LayoutSizesContextType | undefined>(
  undefined
);

interface LayoutSizesProviderProps {
  children: ReactNode;
}

export function LayoutSizesProvider({ children }: LayoutSizesProviderProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [profileDrawerWidth, setProfileDrawerWidth] = useState(0);
  return (
    <LayoutSizesContext.Provider
      value={{
        headerHeight,
        setHeaderHeight,
        profileDrawerWidth,
        setProfileDrawerWidth,
      }}
    >
      {children}
    </LayoutSizesContext.Provider>
  );
}

export function useLayoutSizes() {
  const context = useContext(LayoutSizesContext);
  if (context === undefined) {
    throw new Error("useLayoutSizes must be used within a LayoutSizesProvider");
  }
  return context;
}

export function useHeaderRef<T extends HTMLElement>() {
  const { setHeaderHeight } = useLayoutSizes();
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.target.clientHeight);
      }
    });

    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setHeaderHeight]);

  return elementRef;
}

export function useProfileDrawerRef<T extends HTMLElement>() {
  const { setProfileDrawerWidth } = useLayoutSizes();
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setProfileDrawerWidth(entry.target.clientWidth);
      }
    });

    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setProfileDrawerWidth]);

  return elementRef;
}
