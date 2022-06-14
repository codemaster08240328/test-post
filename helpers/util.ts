export const debounce = (func: Function, delay: number) => {
  let debounceTimer: any;
  return function(_arg: any) {
    // @ts-ignoreignore
    const context = this;
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
} 