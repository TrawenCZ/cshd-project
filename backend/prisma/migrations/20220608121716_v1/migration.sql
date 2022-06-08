-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "aboutMe" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "profilePicture" TEXT NOT NULL DEFAULT 'https://www.rockandpop.eu/wp-content/plugins/buddyboss-platform/bp-core/images/profile-avatar-buddyboss.png'
);
INSERT INTO "new_User" ("aboutMe", "id", "isAdmin", "password", "profilePicture", "username") SELECT "aboutMe", "id", "isAdmin", "password", "profilePicture", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
