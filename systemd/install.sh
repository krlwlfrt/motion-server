# make unitfile available for systemd
systemctl link systemd/motion-server.service

# enable service to start on boot
systemctl enable motion-server.service

# start service now
systemctl start motion-server.service
