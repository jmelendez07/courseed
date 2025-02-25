import React from "react";

function useInView(options = { threshold: 0.1 }) {
    const ref = React.useRef(null);
    const [isVisible, setIsVisible] = React.useState(false);
  
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        options
      );
  
      if (ref.current) observer.observe(ref.current);
  
      return () => observer.disconnect();
    }, [options]);
  
    return [ref, isVisible];
}

export default useInView;