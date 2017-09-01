lvls = 50:150;
crstr = [150, 250, 500, 1000, 2000, 3000, 5000, 8000, 75000];
c = [];
p = zeros(size(lvls));

for i = 1:9
    c(i,:) = (sin(mod(lvls-i,10).*6./i)+1).*(lvls/((i+1)^1.7)) + bitxor(1,fix((lvls / (13-mod(i,10)))/10));
    p = p + c(i,:)*crstr(i)
end



figure
set(gca,'Color',[0.8 0.8 0.8]);
subplot(2,1,1);
hold on;
plot(lvls, c(1,:), 'r');
plot(lvls, c(2,:), 'b');
plot(lvls, c(3,:), 'y');
plot(lvls, c(4,:), 'g');
plot(lvls, c(5,:), 'w');
plot(lvls, c(6,:), 'k');
plot(lvls, c(7,:), 'Color', [0.5,0.2,0.2]);
plot(lvls, c(8,:), 'm');
plot(lvls, c(9,:), 'Color', [1,0.5,0]);
grid on
hold off

subplot(2,1,2);
plot(lvls, p)

grid on