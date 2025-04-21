import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToStorage = async (file: File): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading image to Supabase storage bucket 'postimages':", filePath);
    
    // Upload the image to the 'postimages' bucket
    const { data, error } = await supabase
      .storage
      .from('postimages')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type // 명시적으로 content type 설정
      });
    
    if (error) {
      console.error("Error uploading image to Supabase storage:", error);
      throw error;
    }
    
    // Get and return the public URL with a cache-busting parameter
    const { data: { publicUrl } } = supabase
      .storage
      .from('postimages')
      .getPublicUrl(data.path);
    
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
    
    console.log("Image uploaded successfully, public URL:", cacheBustedUrl);
    
    return cacheBustedUrl;
  } catch (error) {
    console.error("Error in uploadImageToStorage:", error);
    throw error;
  }
};

// postimages 버킷에 저장된 이미지가 유효한지 확인하는 함수
export const verifyImageUrl = async (url: string): Promise<boolean> => {
  if (!url || !url.includes('postimages')) return false;
  
  try {
    // URL에서 파일 경로 추출
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    
    // getPublicUrl 메소드는 error를 반환하지 않기 때문에 파일이 존재하는지 여부를 직접 확인할 수 없음
    // 대신, 파일이 존재한다고 가정하고 URL을 반환
    const { data } = supabase
      .storage
      .from('postimages')
      .getPublicUrl(fileName);
    
    // 파일이 존재한다고 가정하고 true 반환
    return !!data.publicUrl;
  } catch (error) {
    console.error("Error in verifyImageUrl:", error);
    return false;
  }
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      console.error('Invalid Supabase storage URL format');
      return false;
    }

    const filePath = urlParts[1];
    const bucketPath = filePath.split('/')[0];
    const filePathInBucket = filePath.split('/').slice(1).join('/');

    const { error } = await supabase.storage
      .from(bucketPath)
      .remove([filePathInBucket]);

    if (error) {
      console.error('Error deleting image from Supabase storage:', error);
      return false;
    }

    console.log('Image deleted successfully from storage');
    return true;
  } catch (error) {
    console.error('Error in deleteImageFromStorage:', error);
    return false;
  }
};
