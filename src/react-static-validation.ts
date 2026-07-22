type WarnContext = {
    page: {
      routePath: string;
      relativePath?: string;
    };
    onWarn: (message: string) => void;
  };
  
  const warnedKeys = new Set<string>();
  
  function warnOnce(
    key: string,
    message: string,
    onWarn: (message: string) => void,
  ): void {
    if (warnedKeys.has(key)) return;
    warnedKeys.add(key);
    onWarn(message);
  }
  
  function isEventProp(name: string): boolean {
    return /^on[A-Z]/.test(name);
  }
  
  function getElementName(type: unknown): string {
    if (typeof type === 'string') {
      return `<${type}>`;
    }
  
    if (typeof type === 'function') {
      const maybeNamed = type as {
        displayName?: string;
        name?: string;
      };
  
      return maybeNamed.displayName || maybeNamed.name || 'AnonymousComponent';
    }
  
    return 'UnknownElement';
  }
  
  export async function validateStaticJsxTree(
    node: unknown,
    ctx: WarnContext,
  ): Promise<void> {
    const react = await import('react');
    const { isValidElement } = react;
  
    function inspectElement(el: any): void {
      const props = (el.props ?? {}) as Record<string, unknown>;
  
      for (const [key, value] of Object.entries(props)) {
        if (!isEventProp(key)) continue;
        if (typeof value !== 'function') continue;
  
        const elementName = getElementName(el.type);
  
        warnOnce(
          `${ctx.page.routePath}:${elementName}:${key}`,
          `[sitelo] ${ctx.page.relativePath ?? ctx.page.routePath}: prop "${key}" on ${elementName} will not be interactive in static TSX/JSX output. Use a client script or future hydration/islands support instead.`,
          ctx.onWarn,
        );
      }
    }
  
    function walk(value: unknown): void {
      if (value == null || typeof value === 'boolean') return;
      if (typeof value === 'string' || typeof value === 'number') return;
  
      if (Array.isArray(value)) {
        for (const child of value) {
          walk(child);
        }
        return;
      }
  
      if (!isValidElement(value)) return;
  
      inspectElement(value);
  
      walk((value as any).props?.children);
    }
  
    walk(node);
  }