"use client";

import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface CampaignItem {
  _id: string;
  campaign_title?: string;
}

interface AddCampaignsDeleteProps {
  user: CampaignItem;
  onDeleted?: () => void;
}

const AddCampaignsDelete = ({ user, onDeleted }: AddCampaignsDeleteProps) => {
  const { _id, campaign_title } = user;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/campaigns/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete campaign");
      }

      alert(
        data.message ||
          "Campaign deleted successfully. Any approved supporter contributions have been refunded."
      );

      if (onDeleted) {
        onDeleted();
      }
    } catch (err: unknown) {
      console.error("Delete campaign error:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      alert(`Delete error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <Button className="rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold px-3 py-1.5 text-xs hover:bg-red-100 transition shadow-sm inline-flex items-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>

        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[460px] rounded-3xl p-6 shadow-2xl">
              <AlertDialog.CloseTrigger />

              <AlertDialog.Header>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <AlertDialog.Heading className="text-lg font-bold text-gray-900">
                      Delete Campaign?
                    </AlertDialog.Heading>
                    <p className="text-xs text-gray-500">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </AlertDialog.Header>

              <AlertDialog.Body className="py-4 text-sm text-gray-600 space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-900 font-bold">
                    &ldquo;{campaign_title || "this campaign"}&rdquo;
                  </strong>
                  ?
                </p>
                <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                  ⚠️ <strong>Automatic Refund:</strong> All approved supporters of
                  this campaign will automatically be refunded their contributed
                  credits back to their accounts.
                </div>
              </AlertDialog.Body>

              <AlertDialog.Footer className="flex items-center justify-end gap-2 pt-2">
                <Button slot="close" variant="tertiary" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                  Cancel
                </Button>

                <Button
                  onClick={handleDelete}
                  slot="close"
                  isDisabled={loading}
                  className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-red-700 transition"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete & Refund"}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
};

export default AddCampaignsDelete;