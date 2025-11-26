import HomeOutlinedIcon from './home-icon.svg'
import SearchIcon from './search-icon.svg';
import MessageOutlinedIcon from './message-icon.svg';
import SettingsIcon from './settings-icon.svg';
import ProfileIcon from './profile-icon.svg';
export const icons ={
    homeOutlinedIcon:HomeOutlinedIcon,
    searchIcon: SearchIcon,
    messageOutlinedIcon: MessageOutlinedIcon,
    settingsIcon: SettingsIcon,
    profileIcon: ProfileIcon

}

export type IconName = keyof typeof icons