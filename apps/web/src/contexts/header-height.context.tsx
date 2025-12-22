import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface HeaderHeightContextType {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

const HeaderHeightContext = createContext<HeaderHeightContextType | undefined>(
  undefined
);

interface HeaderHeightProviderProps {
  children: ReactNode;
}

export function HeaderHeightProvider({ children }: HeaderHeightProviderProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <HeaderHeightContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </HeaderHeightContext.Provider>
  );
}

export function useHeaderHeight() {
  const context = useContext(HeaderHeightContext);
  if (context === undefined) {
    throw new Error(
      "useHeaderHeight must be used within a HeaderHeightProvider"
    );
  }
  return context;
}

export function useHeaderRef<T extends HTMLElement>() {
  const { setHeaderHeight } = useHeaderHeight();
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
