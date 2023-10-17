import {
  Image,
  download,
  createVideoThumbnail,
  clearCache,
} from "react-native-compressor";

//Compresses the input file URI or base-64 string with the specified options.
//Promise returns a string after compression has completed.
const compressImage = async (uri: string) => {
  try {
    //compress image. Can compress Video.compress("uri/url"//{see docs->optional}) and Audio.compress("uri/url"//{see docs->optional})
    const compressed = await Image.compress(
      uri, //'file://path_of_file/image.jpg' or 'https://path_of_file/image.jpg'
      {
        // progressDivider: 10,
        // downloadProgress: (progress) => {
        //   console.log("downloadProgress: ", progress);
        // },
        // compressionMethod: "manual", default: 'auto' //omit to use Automatic to compress images like whatsapp
        // maxWidth: 1000,//manual//omit to use Automatic //(default: 1280)  //The maximum width boundary used as the main boundary in resizing a landscape image.
        //maxHeight:  //(default: 1280)//The maximum height boundary used as the main boundary in resizing a portrait image.
        //quality: 0.8,//(default: 0.8)//The quality modifier for the JPEG and PNG file format, if your input file is JPEG and output file is PNG then compressed size can be increase
        //input: InputType (default: uri)//Can be either uri or base64, defines the contentents of the value parameter.
        //output: OutputType (default: jpg)//The quality modifier for the JPEG file format, can be specified when output is PNG but will be ignored. if you wanna apply quality modifier then you can enable
        //returnableOutputType: ReturnableOutputType (default: uri)//Can be either uri or base64, defines the Returnable output image format.
      }
    );

    //can also be used to download a file
    // const downloadFileUrl = await download(url, (progress) => {
    //   console.log("downloadProgress: ", progress);
    // });

    // //can also be used to create a video thumbnail
    // const thumbnail = await createVideoThumbnail(videoUri);
    // await clearCache(); // this will clear cache of thumbnails cache directory

    return compressed;
  } catch (error) {
    //return the uncompressed file anyway if error
    return uri;
  }
};

export default compressImage;
