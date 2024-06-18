export const translateDict: Record<string, string> = {
  name: 'שם',
};

export function translate(data: string, params?: string[]) {
  let res = translateDict[data];
  if (res) {
    params?.forEach((param, index) => {
      res = res.replace(`{${index}}`, param);
    });
    return res;
  }
  return data;
}
