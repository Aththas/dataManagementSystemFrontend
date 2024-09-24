import { useEffect } from 'react';

function UseScaleBody(scale) {
  useEffect(() => {
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = `${100 / scale}%`;
  }, [scale]); 
}

export default UseScaleBody;
