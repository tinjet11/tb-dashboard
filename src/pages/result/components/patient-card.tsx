import { Patient } from '@/appwrite/model'

const PatientCard = ({patient}:{patient: Patient}) => {
  return (
    <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">
      Patient Information
    </h2>
    <div className="shadow-sm p-4 rounded-lg">
      <p className="text-base text-gray-600">
        <span className="font-semibold">Name:</span>{" "}
        {patient?.name || "N/A"}
      </p>
      <p className="text-base text-gray-600">
        <span className="font-semibold">Under:</span>{" "}
        {patient?.staffId || "N/A"}
      </p>
    </div>
  </div>

  )
}

export default PatientCard