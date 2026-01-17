import { useEffect, useState } from "react";

export const useQueryParams = () => {

    const getAll = () => {
        const params = new URLSearchParams(window.location.search);
        const obj = {};
        params.forEach((value, key) => obj[key] = value);
        return obj;
    };

    const [params, setParamsState] = useState(getAll);

    useEffect(() => {
        const onPop = () => setParamsState(getAll());
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    const setParams = (newParams) => {
        const current = new URLSearchParams(window.location.search);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined) current.delete(key);
            else current.set(key, value);
        });
        window.history.pushState({}, "", `?${current.toString()}`);
        setParamsState(getAll());
    };

    return [params, setParams];
};