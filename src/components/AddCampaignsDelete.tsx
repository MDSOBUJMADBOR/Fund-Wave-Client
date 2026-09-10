import { AlertDialog, Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";


interface User {
  _id: string;
}

interface AddCampaignsDeleteProps {
  user: User;
}

const AddCampaignsDelete = ({ user }: AddCampaignsDeleteProps) => {
  const { _id } = user;

  const handleDelete = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${_id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await res.json();

    console.log(data);

    redirect("/dashboard/Creator/Home");
  };

  return (
    <div>
      <AlertDialog>
        <Button className="rounded-md bg-red-200 text-red-600">
          <Trash2 />
          Delete
        </Button>

        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />

              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />

                <AlertDialog.Heading>
                  Delete project permanently?
                </AlertDialog.Heading>
              </AlertDialog.Header>

              <AlertDialog.Body>
                <p>
                  This will permanently delete{" "}
                  <strong>My Awesome Project</strong> and all of its
                  data. This action cannot be undone.
                </p>
              </AlertDialog.Body>

              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary">
                  Cancel
                </Button>

                <Button
                  onClick={handleDelete}
                  slot="close"
                  variant="danger"
                >
                  Confirm Delete
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