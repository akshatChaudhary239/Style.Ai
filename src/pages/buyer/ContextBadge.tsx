import { Button } from "@/components/ui/button";
import { StyleContextState } from "@/context/StyleContext";

type Props = {
  draftContext: StyleContextState;
  appliedContext: StyleContextState;
  onApply: () => void;
  onEdit: () => void;
};

export default function ContextBadge({
  draftContext,
  appliedContext,
  onApply,
  onEdit,
}: Props) {
  const isDirty =
    JSON.stringify(draftContext) !== JSON.stringify(appliedContext);

  const hasAppliedContext =
    Object.keys(appliedContext).length > 0;

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4">
      <div className="text-sm">
        {!hasAppliedContext && !isDirty && (
          <span>✨ Based on your profile preferences</span>
        )}

        {hasAppliedContext && !isDirty && (
          <span>
            ✨ Showing recommendations for{" "}
            <strong>{appliedContext.occasion}</strong>
          </span>
        )}

        {isDirty && (
          <span className="text-yellow-600">
            🟡 New context selected:{" "}
            <strong>{draftContext.occasion}</strong>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {isDirty ? (
          <Button size="sm" onClick={onApply}>
            Apply
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onEdit}>
            Change
          </Button>
        )}
      </div>
    </div>
  );
}
