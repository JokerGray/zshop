document.writeln("<ul class=\'layui-nav layui-nav-tree\' lay-filter=\'test\' id=\'menu-tree\'>");
document.writeln("                  <li class=\'layui-nav-item act\'>");
document.writeln("                    <a href=\'javascript:;\'><i class=\'config\'></i>&nbsp;&nbsp;基础设置</a>");
document.writeln("                    <dl class=\'layui-nav-child menu-left\'>");
document.writeln("                      <dd><a href=\'parameter_setting.html\'>&bull;&nbsp;&nbsp;参数设置</a></dd>");
document.writeln("                    </dl>");
document.writeln("                  </li>");
document.writeln("                  <li class=\'layui-nav-item\'>");
document.writeln("                    <a href=\'javascript:;\'><i class=\'config\'></i>&nbsp;&nbsp;人员管理</a>");
document.writeln("                    <dl class=\'layui-nav-child menu-left\'>");
document.writeln("                      <dd><a href=\'system_role.html\'>&bull;&nbsp;&nbsp;角色管理</a></dd>");
document.writeln("                      <dd><a href=\'user_control.html\'>&bull;&nbsp;&nbsp;用户管理</a></dd>");
document.writeln("                      <dd><a href=\'jurisdiction_manage.html\'>&bull;&nbsp;&nbsp;权限管理</a></dd>");
document.writeln("                      <dd><a href=\'system_organization.html\'>&bull;&nbsp;&nbsp;系统组织</a></dd>");
document.writeln("                    </dl>");
document.writeln("                  </li>           ");
document.writeln("                </ul>");

window.onload=function(){
    layui.use('element', function(){
      var element = layui.element();
    });
}

     
