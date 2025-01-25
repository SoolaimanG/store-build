import { Package, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NoProductsFoundProps {
  message?: string;
  suggestion?: string;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
}

export default function NoProductsFound({
  message = "No products found",
  suggestion = "Try adjusting your search or filters to find what you're looking for.",
  showHomeButton = false,
  showRefreshButton = true,
  onRefresh,
}: NoProductsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-2xl font-semibold tracking-tight mb-2">{message}</h3>

      <p className="text-muted-foreground mb-6 max-w-[500px]">{suggestion}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {showRefreshButton && (
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}

        {showHomeButton && (
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
