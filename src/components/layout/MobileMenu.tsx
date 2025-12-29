import { memo, useCallback } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "../ui/button.tsx";

interface MobileMenuProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  onClose: () => void;
}

export const MobileMenu = memo(function MobileMenu({
  onExportExcel,
  onExportPDF,
  onClose,
}: MobileMenuProps) {
  const handleExportExcel = useCallback(() => {
    onExportExcel();
    onClose();
  }, [onExportExcel, onClose]);

  const handleExportPDF = useCallback(() => {
    onExportPDF();
    onClose();
  }, [onExportPDF, onClose]);

  return (
    <div className="mt-6 space-y-4">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleExportExcel}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Експорт в Excel
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleExportPDF}
      >
        <Download className="h-4 w-4 mr-2" />
        Експорт в PDF
      </Button>
    </div>
  );
});
