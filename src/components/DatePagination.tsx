import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface DatePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function DatePagination({ currentPage, totalPages, onPageChange }: DatePaginationProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            {/* Кнопка "Назад" */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-2.5 sm:px-3"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-1">Попередні</span>
            </Button>

            <div className="text-sm text-muted-foreground text-center tabular-nums min-w-[70px]">
                <span className="sm:hidden">
                    {currentPage + 1} / {totalPages}
                </span>
                <span className="hidden sm:inline">
                    Сторінка {currentPage + 1} з {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-2.5 sm:px-3"
            >
                <span className="hidden sm:inline sm:mr-1">Наступні</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}