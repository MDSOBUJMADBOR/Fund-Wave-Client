"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import { Pencil, Gift, FileText, Type, Loader2 } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface EditModalProps {
  book: Campaign;
  onUpdated?: () => void;
}

const EditModal = ({ book, onUpdated }: EditModalProps) => {
  const { _id, campaign_title, campaign_story, reward_info } = book;

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const updatedFields = {
        campaign_title: formData.get("campaign_title"),
        campaign_story: formData.get("campaign_story"),
        reward_info: formData.get("reward_info"),
      };

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/campaigns/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update campaign");
      }

      alert("Campaign updated successfully! ✅");
      if (onUpdated) {
        onUpdated();
      }
    } catch (err: unknown) {
      console.error("Update error:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      alert(`Error updating campaign: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <Button className="rounded-xl border border-violet-200 bg-violet-50 text-violet-700 font-semibold px-3 py-1.5 text-xs hover:bg-violet-100 transition shadow-sm inline-flex items-center gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Update
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg rounded-3xl p-6 shadow-2xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-gray-900">
                Update Campaign Details
              </Modal.Heading>
              <p className="text-xs text-gray-500 mt-1">
                You can update the campaign title, story, and backer reward info.
              </p>
            </Modal.Header>

            <Modal.Body className="py-4">
              <Surface>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  {/* Title */}
                  <TextField className="w-full" name="campaign_title" isRequired defaultValue={campaign_title}>
                    <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                      <Type className="h-3.5 w-3.5 text-violet-600" /> Title
                    </Label>
                    <Input
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500"
                      name="campaign_title"
                      placeholder="Campaign title..."
                    />
                  </TextField>

                  {/* Campaign Story */}
                  <TextField className="w-full" name="campaign_story" isRequired defaultValue={campaign_story}>
                    <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                      <FileText className="h-3.5 w-3.5 text-violet-600" /> Campaign Story
                    </Label>
                    <TextArea
                      name="campaign_story"
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 resize-y"
                      placeholder="Detailed description of your campaign..."
                    />
                  </TextField>

                  {/* Reward Info */}
                  <TextField className="w-full" name="reward_info" defaultValue={reward_info || ""}>
                    <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                      <Gift className="h-3.5 w-3.5 text-violet-600" /> Reward Information
                    </Label>
                    <TextArea
                      name="reward_info"
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 resize-y"
                      placeholder="What supporters receive for their pledges..."
                    />
                  </TextField>

                  <Modal.Footer className="pt-4 flex items-center justify-end gap-2">
                    <Button slot="close" variant="tertiary" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={loading}
                      slot="close"
                      className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-violet-700 transition"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </Modal.Footer>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditModal;