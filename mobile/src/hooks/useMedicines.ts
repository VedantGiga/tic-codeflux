import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const useMedicines = (patientId) => {
  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: (params: { logId: string, status: string }) => 
      patientService.updateDoseStatus(params.logId, params.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard", patientId] }),
  });

  return { updateStatus };
};
