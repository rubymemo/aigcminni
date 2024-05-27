export const getImagePath = (imageUrl: string, type = 'input') => {
  return `http://101.126.93.249/api/hh/comfyui_api/view?type=${type}&filename=${imageUrl}`;
};

export default {};
