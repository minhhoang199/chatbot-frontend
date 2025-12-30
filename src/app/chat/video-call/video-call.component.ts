import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css',
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @Output() ended = new EventEmitter<void>();
  private videoCallName: string = 'defaultRoom';
  // private displayName: string = 'Guest';
  //Home IP
  domain: string = '192.168.1.180:8443';

  //School IP
  // domain: string = '192.168.25.101:8443';
  api: any;
  participants: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.videoCallName = this.route.snapshot.paramMap.get('roomId') || 'defaultRoom';
    this.startMeeting();
  }

  startMeeting(): void {
    const options = { 
      roomName: this.videoCallName,
      width: '100%',
      height: '100%',
      // parentNode: document.querySelector('#jitsi-container'),
      // userInfo: {
      //   displayName: this.displayName,
      // },
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'chat', 'hangup'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Guest',
      },
    };

    this.api = new JitsiMeetExternalAPI(this.domain, options);

    //some one join
    this.api.addListener('participantJoined', (user: any) => {
      console.log('Người tham gia:', user);
      this.participants.push(user.id);
    });

    this.api.addListener('participantLeft', (user: any) => {
      this.participants = this.participants.filter((id) => id !== user.id);
      if (this.participants.length === 0) {
        this.ended.emit();
        this.leaveMeeting();
      }
    });

    this.api.addListener('videoConferenceLeft', () => {
      this.ended.emit();
      this.leaveMeeting();
    });
  }

  toggleMic() {
    this.api.executeCommand('toggleAudio');
  }

  toggleCamera() {
    this.api.executeCommand('toggleVideo');
  }

  leaveMeeting() {
    this.api.executeCommand('hangup');
    window.close();
  }

  ngOnDestroy(): void {
    if (this.api) this.api.dispose();
  }
}
