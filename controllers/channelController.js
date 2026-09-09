import Channel from "../models/Channel.js";
// Create Channel
export const createChannel = async (req, res) => {
    try {
        // Find the channel with the highest existing channelId.
        const lastChannel = await Channel.findOne()
            .sort({ channelId: -1 });

        // Start channel numbering from 1.
        let nextNumber = 1;

        // Check whether any channel already exists.
        if (lastChannel) {

            // Extract the number from the existing channelId.
            const lastNumber = parseInt(
                lastChannel.channelId.replace(/\D/g, ""),
                10
            );

            // Generate the next channel number.
            nextNumber = lastNumber + 1;
        }

        // Generate the next unique channel ID.
        const channelId = `channel${String(nextNumber).padStart(2, "0")}`;

        // Get channel details from request body
        const {
            channelName,
            description,
            channelBanner
        } = req.body;

        // Create and save channel in MongoDB
        const channel = await Channel.create({
            channelId,
            channelName,

            owner: req.user.userId,
            description,
            channelBanner
        });

        // Send successful response
        res.status(201).json({
            message: "Channel created successfully",
            channel
        });
        // Send error response
    } catch (error) {
        res.status(400).json({
            message: "Failed to create channel",
            error: error.message
        });
    }
};


// Get All Channels
export const getChannels = async (req, res) => {
    try {
        // Find all channels from MongoDB
        const channels = await Channel.find();
        // Send channels as response
        res.status(200).json(channels);

    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to fetch channels",
            error: error.message
        });
    }
};


// Get Channel By ID
export const getChannelById = async (req, res) => {
    try {
        // Find channel using channelId from URL
        const channel = await Channel.findOne({
            channelId: req.params.id
        });
        // Check whether channel exists
        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }
        // Send channel details

        res.status(200).json(channel);

    } catch (error) {
        // Send error response                
        res.status(500).json({
            message: "Failed to fetch channel",
            error: error.message
        });
    }
};


// Update Channel
export const updateChannel = async (req, res) => {
    try {
        // Find channel using channelId
        const channel = await Channel.findOne(
            { channelId: req.params.id }

        );
        // Check whether channel exists
        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }
        // Check whether logged-in user is the owner
        if (String(channel.owner) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can update only your own channel"
            });
        }

        // Get only the fields that can be updated.
        const {
            channelName,
            description,
            channelBanner
        } = req.body;

        
        // Update only the fields that were provided.
        if (channelName !== undefined) {
            channel.channelName = channelName;
        }

        if (description !== undefined) {
            channel.description = description;
        }

        if (channelBanner !== undefined) {
            channel.channelBanner = channelBanner;
        }
        // Save updated channel.
        await channel.save();

        // Send updated channel
        res.status(200).json({
            message: "Channel updated successfully",
            channel: channel
        });
        // Send error response
    } catch (error) {
        res.status(400).json({
            message: "Failed to update channel",
            error: error.message
        });
    }
};


// Delete Channel
export const deleteChannel = async (req, res) => {
    try {
        // Find channel using channelId

        const channel = await Channel.findOne({
            channelId: req.params.id
        });

        // Check whether channel exists

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }
        // Check whether logged-in user is the owner
        if (String(channel.owner) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can delete only your own channel"
            });
        }
        // Delete channel from MongoDB
        await Channel.findOneAndDelete({
            channelId: req.params.id
        });


        // Send successful response
        res.status(200).json({
            message: "Channel deleted successfully"
        });

        // Send error response
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete channel",
            error: error.message
        });
    }
};
