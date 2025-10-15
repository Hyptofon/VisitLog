import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface DatePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function DatePagination({ currentPage, totalPages, onPageChange }: DatePaginationProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Попередні
            </Button>
            <span className="text-sm text-muted-foreground px-2">
        Сторінка {currentPage + 1} з {totalPages}
      </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            >
                Наступні
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );
}
