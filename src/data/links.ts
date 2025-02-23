import TwitterIcon from '@/components/icons/TwitterIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import EmailIcon from '@/components/icons/EmailIcon'
import ResumeIcon from '@/components/icons/ResumeIcon'
// ADD YOUR SOCIAL NETWORKS HERE
export const SOCIALNETWORKS = [
	{
		name: 'Github',
		url: 'https://github.com/zycccishere',
		icon: GithubIcon
	},

	{
		name: 'Email',
		url: 'mailto:zhangyic23@mails.tsinghua.edu.cn',
		icon: EmailIcon
	},

	{
		name: 'CV',
		url: 'pdfs/resume.pdf',
		icon: ResumeIcon
	}
] as const
