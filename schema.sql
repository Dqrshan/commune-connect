-- Community Network Database Schema
-- MySQL/MariaDB compatible SQL schema

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS community_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE community_network;

-- Users table
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `subscriptionTier` ENUM('FREE', 'PERSONAL', 'BUSINESS') NOT NULL DEFAULT 'FREE',
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accounts table for OAuth providers
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INT NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sessions table for NextAuth
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verification tokens for email verification
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Communities table
CREATE TABLE `Community` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `radius` DOUBLE NOT NULL DEFAULT 5.0,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Community members junction table
CREATE TABLE `CommunityMember` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `communityId` VARCHAR(191) NOT NULL,
    `role` ENUM('MEMBER', 'MODERATOR', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CommunityMember_userId_communityId_key`(`userId`, `communityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Posts table
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('GENERAL', 'QUESTION', 'ALERT', 'ROADBLOCK', 'PROTEST') NOT NULL DEFAULT 'GENERAL',
    `userId` VARCHAR(191) NOT NULL,
    `communityId` VARCHAR(191) NOT NULL,
    `aiTags` TEXT NULL,
    `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Comments table
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Business table
CREATE TABLE `Business` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Business-Community partnerships
CREATE TABLE `BusinessCommunity` (
    `id` VARCHAR(191) NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,
    `communityId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BusinessCommunity_businessId_communityId_key`(`businessId`, `communityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add Foreign Key Constraints
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CommunityMember` ADD CONSTRAINT `CommunityMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CommunityMember` ADD CONSTRAINT `CommunityMember_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Post` ADD CONSTRAINT `Post_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Business` ADD CONSTRAINT `Business_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `BusinessCommunity` ADD CONSTRAINT `BusinessCommunity_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Business`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `BusinessCommunity` ADD CONSTRAINT `BusinessCommunity_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX `idx_user_location` ON `User`(`latitude`, `longitude`);
CREATE INDEX `idx_community_location` ON `Community`(`latitude`, `longitude`, `radius`);
CREATE INDEX `idx_community_active` ON `Community`(`isActive`);
CREATE INDEX `idx_post_community_created` ON `Post`(`communityId`, `createdAt` DESC);
CREATE INDEX `idx_post_priority_created` ON `Post`(`priority` DESC, `createdAt` DESC);
CREATE INDEX `idx_comment_post` ON `Comment`(`postId`, `createdAt` DESC);
CREATE INDEX `idx_community_member_user` ON `CommunityMember`(`userId`);
CREATE INDEX `idx_community_member_community` ON `CommunityMember`(`communityId`);

-- Insert sample data for development/testing
INSERT INTO `User` (`id`, `name`, `email`, `role`, `subscriptionTier`, `latitude`, `longitude`, `createdAt`, `updatedAt`) VALUES
('admin-user-1', 'Admin User', 'admin@communitynetwork.com', 'ADMIN', 'BUSINESS', 40.7128, -74.0060, NOW(), NOW()),
('test-user-1', 'John Doe', 'john@example.com', 'USER', 'FREE', 40.7589, -73.9851, NOW(), NOW()),
('test-user-2', 'Jane Smith', 'jane@example.com', 'USER', 'PERSONAL', 40.7505, -73.9934, NOW(), NOW());

INSERT INTO `Community` (`id`, `name`, `description`, `latitude`, `longitude`, `radius`, `isActive`, `createdAt`, `updatedAt`) VALUES
('community-1', 'Manhattan Central', 'Central Manhattan community for commuters and residents', 40.7589, -73.9851, 5.0, true, NOW(), NOW()),
('community-2', 'Brooklyn Heights', 'Brooklyn Heights neighborhood community', 40.6962, -73.9961, 3.0, true, NOW(), NOW()),
('community-3', 'Queens Plaza', 'Queens Plaza area community hub', 40.7505, -73.9934, 4.0, true, NOW(), NOW());

INSERT INTO `CommunityMember` (`id`, `userId`, `communityId`, `role`, `joinedAt`) VALUES
('member-1', 'admin-user-1', 'community-1', 'ADMIN', NOW()),
('member-2', 'test-user-1', 'community-1', 'MEMBER', NOW()),
('member-3', 'test-user-2', 'community-3', 'MEMBER', NOW());

INSERT INTO `Post` (`id`, `title`, `content`, `type`, `userId`, `communityId`, `priority`, `aiTags`, `createdAt`, `updatedAt`) VALUES
('post-1', 'Welcome to Manhattan Central!', 'This is our community hub for sharing information, asking questions, and staying connected.', 'GENERAL', 'admin-user-1', 'community-1', 'NORMAL', '["welcome", "community", "introduction"]', NOW(), NOW()),
('post-2', 'Traffic Alert: 5th Avenue', 'Heavy traffic on 5th Avenue due to construction. Consider alternate routes.', 'ALERT', 'test-user-1', 'community-1', 'HIGH', '["traffic", "alert", "construction", "5th-avenue"]', NOW(), NOW()),
('post-3', 'Best Coffee Shops?', 'New to the area - any recommendations for good coffee shops nearby?', 'QUESTION', 'test-user-2', 'community-3', 'NORMAL', '["coffee", "recommendations", "local-business"]', NOW(), NOW());

-- Create a view for community statistics
CREATE VIEW `CommunityStats` AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.latitude,
    c.longitude,
    c.radius,
    c.isActive,
    COUNT(DISTINCT cm.userId) as memberCount,
    COUNT(DISTINCT p.id) as postCount,
    MAX(p.createdAt) as lastPostAt,
    c.createdAt,
    c.updatedAt
FROM `Community` c
LEFT JOIN `CommunityMember` cm ON c.id = cm.communityId
LEFT JOIN `Post` p ON c.id = p.communityId
GROUP BY c.id, c.name, c.description, c.latitude, c.longitude, c.radius, c.isActive, c.createdAt, c.updatedAt;

-- Create a view for user feed
CREATE VIEW `UserFeed` AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.type,
    p.priority,
    p.aiTags,
    p.createdAt,
    p.updatedAt,
    u.name as userName,
    u.image as userImage,
    c.name as communityName,
    COUNT(DISTINCT co.id) as commentCount
FROM `Post` p
JOIN `User` u ON p.userId = u.id
JOIN `Community` c ON p.communityId = c.id
LEFT JOIN `Comment` co ON p.id = co.postId
GROUP BY p.id, p.title, p.content, p.type, p.priority, p.aiTags, p.createdAt, p.updatedAt, u.name, u.image, c.name
ORDER BY p.priority DESC, p.createdAt DESC;