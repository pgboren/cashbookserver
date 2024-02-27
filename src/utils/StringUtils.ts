class StringUtils {
    
    // Declare the methods as static to access them without creating an object
    static replaceAll(str: string, find: string, replace: string) {
      return str.replace(new RegExp(this.escapeRegExp(find), "g"), replace);
    }
  
    static escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  
}

export { StringUtils };
