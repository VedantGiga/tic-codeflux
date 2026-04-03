import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => patientService.getAll(),
  });
};
