import { atom, useAtom } from "jotai";

const isLoadingAtom = atom<boolean>(false);

export const useIsLoading = () => {
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
    return { isLoading, setIsLoading };
}   