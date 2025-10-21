import { History } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { GradeHistory as GradeHistoryType } from '@/types';

interface GradeHistoryDialogProps {
    history: GradeHistoryType[];
    isOpen: boolean;
    onClose: () => void;
}

const HistoryValueDisplay = ({ label, value, colorClass }: { label: string, value: React.ReactNode, colorClass?: string }) => (
    <p>
        <span className="text-gray-600">{label}:</span>{' '}
        <span className={colorClass || 'font-medium'}>
            {value}
        </span>
    </p>
);

const HistoryCommentDisplay = ({ comment }: { comment?: string }) => {
    if (!comment) return null;
    return (
        <p className="mt-1">
            <span className="text-gray-600">Коментар:</span>{' '}
            <span className="text-gray-700 italic">"{comment}"</span>
        </p>
    );
};

export function GradeHistoryDialog({ history, isOpen, onClose }: GradeHistoryDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Історія змін оцінки
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {history.length > 0 ? (
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-4">
                                {history.map((entry, idx) => (
                                    <Card key={idx} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <History className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-sm">{entry.changedBy}</span>
                                                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-500 font-medium">Було:</p>
                                                        <div className="pl-3 border-l-2 border-red-300">
                                                            <HistoryValueDisplay
                                                                label="Присутність"
                                                                value={entry.oldValue.attended ? '✓ Так' : '✗ Ні'}
                                                                colorClass={entry.oldValue.attended ? 'text-green-600' : 'text-red-600'}
                                                            />
                                                            <HistoryValueDisplay
                                                                label="Оцінка"
                                                                value={entry.oldValue.score !== null ? entry.oldValue.score : '-'}
                                                            />
                                                            <HistoryCommentDisplay comment={entry.oldValue.comment} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-500 font-medium">Стало:</p>
                                                        <div className="pl-3 border-l-2 border-green-300">
                                                            <HistoryValueDisplay
                                                                label="Присутність"
                                                                value={entry.newValue.attended ? '✓ Так' : '✗ Ні'}
                                                                colorClass={entry.newValue.attended ? 'text-green-600' : 'text-red-600'}
                                                            />
                                                            <HistoryValueDisplay
                                                                label="Оцінка"
                                                                value={entry.newValue.score !== null ? entry.newValue.score : '-'}
                                                            />
                                                            <HistoryCommentDisplay comment={entry.newValue.comment} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                            <History className="h-12 w-12 mb-2" />
                            <p className="text-sm">Історія змін порожня</p>
                            <p className="text-xs mt-1">Змін ще не було</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>
                        Закрити
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}