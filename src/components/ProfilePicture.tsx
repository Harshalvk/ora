import React from "react";
import Image from "next/image";

type Props = {
  profileUrl: string;
  name: string;
};

const ProfilePicture = ({ profileUrl, name }: Props) => {
  return (
    <div className="flex flex-col">
      <p className="text-lg text-white">Profile Picture</p>
      <div className="flex h-fit flex-col items-start justify-start">
        <Image
          src={profileUrl}
          alt={`${name} profile picture`}
          width={200}
          height={200}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
