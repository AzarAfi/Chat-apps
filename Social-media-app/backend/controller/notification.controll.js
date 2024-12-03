import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch notifications for the user and populate the 'from' field
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username profileImg"
            });

        // Mark notifications as read
        await Notification.updateMany({ to: userId }, { read: true });

        // Return the notifications
        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in get notification controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete all notifications for the user
       await Notification.deleteMany({ to: userId });

        res.status(200).json({ message: "Notifications deleted successfully" });

    } catch (error) {
        console.log("Error in delete notification controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

