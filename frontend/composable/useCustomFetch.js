/**
 *
 * @param {*} endPoint
 * @returns
 */
const useCustomFetch = (endPoint) => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref(null);
  /**
   *
   * @param {*} headers
   * @param {*} [params]
   * @param {*} [body]
   * @param {*} method
   * @returns
   */
  const fetch = async (headers, params, body, method) => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.baseUrl}${endPoint}`, {
        method: method,
        headers: headers,
        params: params,
        body: body,
      });

      if (!data) {
        return;
      }
      isLoading.value = false;
      return data;
    } catch (e) {
      isLoading.value = false;
      if (e?.response?.status === 401) {
        router.push("/signin");
      } else {
        error.value = e instanceof Error ? e.message : JSON.stringify(e);
      }

      console.error(error.value);
      throw new Error(`Failed to fetch on url: ${endPoint}`);
    }
  };
  return { fetch, isLoading };
};
export default useCustomFetch;
