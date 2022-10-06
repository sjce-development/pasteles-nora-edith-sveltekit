import type { LayoutLoad } from './$types';

export const ssr = true;

export const load: LayoutLoad = async () => {
  return {
    props: {
      title: 'Pastelería',
    },
  };
};