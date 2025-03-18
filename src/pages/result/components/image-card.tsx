import { Analysis } from "@/appwrite/model";
import storageHandler from "@/appwrite/storage";

const ImageCard = ({ analysis }: { analysis: Analysis }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Images</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center w-full">
          <p className="text-sm font-semibold text-gray-600">Original Image:</p>
          {analysis?.original_image_id ? (
            <img
              src={storageHandler.Analysis.getFileView(
                analysis.original_image_id
              )}
              alt="Original Image"
              className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg border"
            />
          ) : (
            <p className="text-sm text-gray-600">No Original Image Available</p>
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <p className="text-sm font-semibold text-gray-600">
            Segmented Image:
          </p>
          {analysis?.segmented_image_id ? (
            <img
              src={storageHandler.Analysis.getFileView(
                analysis.segmented_image_id
              )}
              alt="Segmented Image"
              className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg border"
            />
          ) : (
            <p className="text-sm text-gray-600">
              No Segmented Image Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
