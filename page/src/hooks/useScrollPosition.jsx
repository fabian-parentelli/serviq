import { useEffect, useState } from 'react';

const useScrollPosition = (ref) => {
    
    const [scroll, setScroll] = useState({
        scrollTop: 0,
        percentage: 0
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onScroll = () => {
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            const clientHeight = el.clientHeight;

            const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

            setScroll({
                scrollTop,
                percentage: Math.round(percentage)
            });
        };

        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [ref]);

    return scroll;
};

export default useScrollPosition;